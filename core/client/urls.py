from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("check/<client_id>", views.ClientView.as_view(), name="client")
]
