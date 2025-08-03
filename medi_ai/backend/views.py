

from django.core.cache import cache  # Or use sessions
from PIL import Image
import google.generativeai as genai
import io
import json
import base64

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializer import UserSerializer, MedicalReportSerializer
from .models import User

class Login(APIView):
    pass

class User_API(APIView):
    def get(self, request, id=None):
        try:
            data = User.objects.all()
            serializer = UserSerializer(data, many = True)
            return Response({"message": serializer.data}, status.HTTP_200_OK)
        
        except Exception as error:
            return Response({"message": str(error)}, status.HTTP_404_NOT_FOUND)
    
    def post(self, request):
        serializer = UserSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':"user registered successfully"}, status.HTTP_200_OK)
        else:
            return Response({"message: ":f"user registration failed error:{serializer.errors}"}, status.HTTP_400_BAD_REQUEST)

class MedicineScannerAPI(APIView):
    def post(self, request):
        try:
            # Get the uploaded image
            image_file = request.data.get('image')
            
            if not image_file:
                return Response({
                    "success": False,
                    "error": "No image provided"
                }, status=status.HTTP_400_BAD_REQUEST)

            # Read and process the image
            img_data = image_file.read()
            pil_image = Image.open(io.BytesIO(img_data))

            # Configure Gemini AI
            model = genai.GenerativeModel('gemini-2.0-flash')
            
            # Create a comprehensive prompt for medicine analysis
            medicine_prompt = """
            You are a professional medical information AI assistant. Analyze this medicine image and provide detailed, accurate information in JSON format.

            Please analyze the medicine in the image and return a JSON response with the following structure:
            {
                "success": true,
                "medicine": {
                    "name": "Medicine name with dosage",
                    "genericName": "Generic/active ingredient name", 
                    "dosage": "Dosage strength",
                    "manufacturer": "Manufacturing company",
                    "category": "Medicine category/type",
                    "description": "Brief description of the medicine",
                    "confidence": 85-99 (confidence percentage as integer),
                    "uses": [
                        "Primary indication 1",
                        "Primary indication 2",
                        "Primary indication 3"
                    ],
                    "sideEffects": [
                        "Common side effect 1",
                        "Common side effect 2", 
                        "Serious side effect (if any)"
                    ],
                    "precautions": [
                        "Important precaution 1",
                        "Important precaution 2",
                        "Dosage warning"
                    ],
                    "interactions": [
                        "Drug interaction 1",
                        "Drug interaction 2",
                        "Food/substance to avoid"
                    ],
                    "price": {
                        "min": 25,
                        "max": 75,
                        "currency": "NPR"
                    },
                    "availability": "available" or "limited" or "unavailable",
                    "prescriptionRequired": true or false
                }
            }

            Important guidelines:
            1. Only provide information if you can clearly identify the medicine from the image
            2. If the image is unclear or you cannot identify the medicine, return: {"success": false, "error": "Unable to identify medicine from image. Please ensure the label is clear and readable."}
            3. Provide only factual, medically accurate information
            4. Include appropriate medical disclaimers in side effects and precautions
            5. Be conservative with confidence scores - only use 90+ if you're very certain
            6. For price, provide reasonable estimates in Nepali Rupees (NPR)
            7. Ensure all arrays have at least 3 relevant items
            8. Do not make up information - if unsure about specific details, use general but accurate information

            Return only the JSON response, no additional text.
            """

            # Generate response from Gemini
            response = model.generate_content([medicine_prompt, pil_image])
            
            # Parse the JSON response
            try:
                # Clean the response text to extract JSON
                response_text = response.text.strip()
                if response_text.startswith('```json'):
                    response_text = response_text[7:-3]
                elif response_text.startswith('```'):
                    response_text = response_text[3:-3]
                
                # Parse JSON
                medicine_data = json.loads(response_text)
                
                # Validate the response structure
                if not medicine_data.get('success', False):
                    return Response({
                        "success": False,
                        "error": medicine_data.get('error', 'Failed to analyze medicine')
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Add timestamp to the response
                medicine_data['medicine']['timestamp'] = None  # Frontend will handle this
                
                return Response(medicine_data, status=status.HTTP_200_OK)
                
            except json.JSONDecodeError:
                # If JSON parsing fails, return a fallback response
                return Response({
                    "success": False,
                    "error": "Unable to process medicine analysis. Please try with a clearer image."
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "success": False,
                "error": f"Medicine scanning failed: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Label_Explaner(APIView):
    def post(self, request):
    # Configure Gemini
    
        session_key = request.headers.get('Session-Key')  # Or use cookies
        prompt = request.data.get('prompt')
        image_file = request.data.get('image')

        if not prompt:
            return Response({"error": "Prompt is required"}, status=400)

        # Case 1: New image upload (store in cache/session)
        if image_file:
            try:
                img_data = image_file.read()
                cache.set(f"{session_key}_image", img_data, timeout=3600)  # Store for 1 hour
                pil_image = Image.open(io.BytesIO(img_data))

                # Initial analysis to establish context
                model = genai.GenerativeModel('gemini-2.0-flash')
                response = model.generate_content([
                    prompt, 
                    pil_image
                ])

                cache.set(f"{session_key}_context", response.text, timeout=3600)
                return Response({"message": "Image context stored", "Response":response.text})

            except Exception as e:
                return Response({"error": str(e)}, status=500)

        # Case 2: Existing session (use cached image/context)
        else:
            cached_img = cache.get(f"{session_key}_image")
            cached_context = cache.get(f"{session_key}_context") or ""

            if not cached_img:
                return Response(
                    {"error": "No image context found. Upload an image first."},
                    status=400
                )

            try:
                pil_image = Image.open(io.BytesIO(cached_img))
                model = genai.GenerativeModel('gemini-2.0-flash')

                # Combine cached context with new prompt
                full_prompt = f"{cached_context}\n\nNew question: {prompt}"
                response = model.generate_content([full_prompt, pil_image])

                # Update context
                cache.set(f"{session_key}_context", response.text, timeout=3600)
                return Response({"response": response.text})

            except Exception as e:
                return Response({"error": str(e)}, status=500)
    
    
class Medical_Report_Analyzer(APIView):
    def post(self, request):
        try:
            # Get the uploaded image and prompt
            image_file = request.data.get('image')
            user_prompt = request.data.get('prompt', '')
            
            if not image_file:
                return Response({
                    "success": False,
                    "error": "No medical report image provided"
                }, status=status.HTTP_400_BAD_REQUEST)

            # Read and process the image
            img_data = image_file.read()
            pil_image = Image.open(io.BytesIO(img_data))

            # Configure Gemini AI
            model = genai.GenerativeModel('gemini-2.0-flash')
            
            # Create a comprehensive prompt for medical report analysis
            if user_prompt:
                # User has specific question
                base_prompt = f"""
                You are a medical AI assistant specializing in medical report interpretation. Analyze this medical report image and answer the user's specific question.

                User's Question: "{user_prompt}"

                Please provide a detailed, professional response addressing the user's question. Include:
                1. Direct answer to their specific question
                2. Relevant findings from the report that relate to their question
                3. Medical context and explanation in simple terms
                4. Any important observations or recommendations
                5. Confidence level in your analysis

                Guidelines:
                - Provide clear, easy-to-understand explanations
                - Include relevant medical values or findings
                - Explain what abnormal values might indicate
                - Suggest appropriate next steps or follow-ups
                - Always include medical disclaimers
                - If you cannot clearly read the report, mention this limitation

                Format your response as a detailed explanation rather than structured data.
                """
            else:
                # General analysis
                base_prompt = """
                You are a medical AI assistant specializing in medical report interpretation. Analyze this medical report image and provide a comprehensive interpretation.

                Please provide a detailed analysis including:
                1. Type of medical report/test
                2. Key findings and values
                3. Normal vs abnormal results
                4. Clinical significance of findings
                5. Potential health implications
                6. Recommended next steps or follow-ups
                7. Confidence level in your analysis

                Guidelines:
                - Explain medical terms in simple language
                - Highlight any concerning findings
                - Provide context for what values mean
                - Include appropriate medical disclaimers
                - If image quality affects analysis, mention this
                - Structure your response clearly

                Provide a comprehensive but understandable analysis.
                """

            # Generate response from Gemini
            response = model.generate_content([base_prompt, pil_image])
            
            # Return the AI response
            return Response({
                "success": True,
                "aiResponse": response.text,
                "userPrompt": user_prompt,
                "timestamp": None,  # Frontend will handle this
                "confidence": 85  # Default confidence for medical reports
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "success": False,
                "error": f"Medical report analysis failed: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Medical_ReportAPI(APIView):
    def post(self, request):
        serializer = MedicalReportSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':"report uploaded successfully"}, status.HTTP_200_OK)
        else:
            return Response({"message: ":f"report upload failed error:{serializer.errors}"}, status.HTTP_400_BAD_REQUEST)

class Get_Appointment(APIView):
    pass

class Medical_Report(APIView):
    pass

class Online_Consultation(APIView):
    pass
