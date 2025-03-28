from rest_framework import serializers
from .models import WorkSpace
from workpage.serializers import WorkPageSerializer
from urllib.parse import urljoin

class WorkSpaceSerializer(serializers.ModelSerializer):
    workpages = WorkPageSerializer(many=True, read_only=True)

    class Meta:
        model = WorkSpace
        fields = ['id', 'name', 'description', 'image', 'slug', 'workpages']
        read_only_fields = ['user']
        extra_kwargs = {
            'image': {'required': False}
        }

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        if instance.image:
            request = self.context.get('request')
            print(request)
            if request:
                # Tenta pegar o host do frontend de várias formas
                frontend_host = (
                    request.META.get('HTTP_ORIGIN') or          # Cabeçalho Origin
                    request.META.get('HTTP_REFERER') or        # Cabeçalho Referer
                    request.META.get('HTTP_X_FORWARDED_HOST') or # Proxy reverso
                    request.META.get('HTTP_HOST')               # Host atual
                )
                print(frontend_host)
                if frontend_host:
                    # Limpa o host (remove caminhos extras)
                    if 'http' not in frontend_host:
                        scheme = request.scheme
                        frontend_host = f"{scheme}://{frontend_host}"
                    
                    # Extrai apenas o domínio:porta
                    frontend_base = frontend_host.split('//')[1].split('/')[0]
                    frontend_host = f"{request.scheme}://{frontend_base}"
                    
                    representation['image'] = f"{frontend_host}{instance.image.url}"
                else:
                    representation['image'] = request.build_absolute_uri(instance.image.url)
            else:
                representation['image'] = instance.image.url
        
        return representation
    
  
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)