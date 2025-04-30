from django.db import models
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify
from workpage.models import WorkPage


class WorkSpace(models.Model):
    name = models.CharField(verbose_name="Nome do WorkSpace", max_length=200)
    slug = models.SlugField(null=True, blank=True, unique=True)
    description = models.TextField(verbose_name="Descrição", blank=True, null=True)
    image = models.ImageField(verbose_name="Imagem", upload_to='workspace/', blank=True, null=True)
    workpages = models.ManyToManyField(to=WorkPage, blank=True, null=True)
    user = models.ManyToManyField(to=User)
    views = models.IntegerField(default=0)

    def save(self, *args, **kwargs):  # new
        if not self.slug:
            self.slug = slugify(self.name)
        return super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name