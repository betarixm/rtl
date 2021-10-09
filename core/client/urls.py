from django.urls import path
from django.contrib.admin.views.decorators import staff_member_required
from . import views

urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("check/<client_id>", views.ClientView.as_view(), name="client"),
    path("register/enable/", staff_member_required(views.EnableRegisterView.as_view()), name="register_flag")
]
