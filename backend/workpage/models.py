from django.db import models


class WorkPage(models.Model):
    name = models.CharField(verbose_name="Nome do WorkSpace", max_length=200)
    url = models.URLField(verbose_name="Url Destino", blank=True, null=True)
    type = models.CharField(max_length=200, choices=(('external', 'external'), ('embed', 'embed')))
    group = models.CharField(verbose_name="Nome do agrupamento", max_length=200, default='', blank=True, null=True)

    class Meta:
        ordering = ['-pk']

    def __str__(self):
        return self.name