from django.views import View
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from phonenumber_field.phonenumber import PhoneNumber
import json

from rtl import flags
from .models import Client


@method_decorator(csrf_exempt, name="dispatch")
class RegisterView(View):
    def post(self, request):
        if not flags.REGISTER_ENABLED:
            return JsonResponse({"success": False, "errors": "지금은 등록할 수 없습니다."}, status=400)
        
        body = json.loads(request.body)

        student_id, name, phone_number = body["id"], body["name"], body["phone_number"]

        try:
            client = Client(
                id=student_id,
                name=name,
                phone_number=PhoneNumber.from_string(
                    phone_number=phone_number, region="KR"
                ),
            )

            client.clean()
            client.full_clean()

        except ValidationError as e:
            return JsonResponse({"success": False, "errors": e.messages}, status=400)

        except Exception as e:
            return JsonResponse({"success": False, "errors": str(e)}, status=400)

        client.save()

        return JsonResponse({"success": True})


class ClientView(View):
    def get(self, request, client_id):
        client = Client.objects.filter(id=client_id).first()

        if client is None:
            return JsonResponse({"success": False})
        else:
            return JsonResponse({"success": True})


class EnableRegisterView(View):
    def get(self, request):
        flag:str = request.GET.get("flag", None)

        if flag is not None:
            flag = flag.lower()
            
            if flag == "true":
                flags.REGISTER_ENABLED = True
            elif flag == "false":
                flags.REGISTER_ENABLED = False

        return JsonResponse({"success": True, "REGISTER_ENABLED": flags.REGISTER_ENABLED})
