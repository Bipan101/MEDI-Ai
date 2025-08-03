from django.urls import path
from .views import User_API, Label_Explaner, Medical_ReportAPI, MedicineScannerAPI, Medical_Report_Analyzer

urlpatterns = [
    path("user/", User_API.as_view(), name="user"),
    path("label-explaner/", Label_Explaner.as_view(), name="labelExplaner"),
    path("medical-report/", Medical_ReportAPI.as_view(), name="medicalReport"),
    path("medicine-scanner/", MedicineScannerAPI.as_view(), name="medicineScanner"),
    path("medical-report-analyzer/", Medical_Report_Analyzer.as_view(), name="medicalReportAnalyzer")
]