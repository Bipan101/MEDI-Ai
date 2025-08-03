from rest_framework import serializers
from .models import User, User_Credential, Medical_Reports
# import cloudinary  # Temporarily commented out

class UserCredentialSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_Credential
        fields = ['user_role', 'user_password']

class UserSerializer(serializers.ModelSerializer):
    credential = UserCredentialSerializer(write_only = True)
    
    class Meta:
        model = User
        fields = ['user_id', 'user_name', 'user_phone_no', 'user_email', 'user_location', 'user_DOB', 'credential']
        read_only_fields = ['user_id']

    def create(self, validated_data):
        credential_data = validated_data.pop('credential')
        user = User.objects.create(**validated_data)
        User_Credential.objects.create(user=user, **credential_data)
        return user
    
class MedicalReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medical_Reports
        fields = '__all__'
        read_only_fields = ['report_id']

    def create(self, validated_data):
        # For now, just create without cloudinary upload
        # Remove the temporary image field from validated_data
        image_file = validated_data.pop('image', None)
        
        # Initialize the report without saving
        report = Medical_Reports(**validated_data)
        
        # For testing, just set a placeholder URL
        if image_file:
            report.report_image_url = "placeholder_url"
        
        # Save the report
        report.save()
        return report