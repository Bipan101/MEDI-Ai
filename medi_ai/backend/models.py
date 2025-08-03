from django.db import models
import uuid

# Create your models here.
class User(models.Model):
    user_id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    user_name = models.CharField(max_length=100)
    user_phone_no = models.CharField(max_length=20)
    user_email = models.EmailField(unique=True)
    user_location = models.CharField(max_length=200)
    user_DOB = models.DateField()

    def __str__(self):
        return self.user_id
    
class User_Credential(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, editable=False)
    user_role = models.CharField(max_length=10)
    user_password = models.TextField()

    def __str__(self):
        return self.user
    
class Medical_Reports(models.Model):
    report_id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="medical_reports")
    report_image_url = models.TextField()

    def __str__(self):
        return self.report_id