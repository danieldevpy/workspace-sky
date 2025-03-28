from django.db import models

class WorkPage(models.Model):
    name = models.CharField(verbose_name="Nome do WorkSpace", max_length=200)
    # description = models.TextField(verbose_name="Descrição", blank=True, null=True)
    # image = models.ImageField(verbose_name="Imagem", upload_to='workpage/', blank=True, null=True)
    url = models.URLField(verbose_name="Url Destino", blank=True, null=True)
    #config
    type = models.CharField(max_length=200, choices=(('external', 'external'), ('embed', 'embed')))
    # workspaces = models.ManyToManyField(to=WorkSpace)


    def __str__(self):
        return self.name