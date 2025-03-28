from django.contrib import admin
from .models import WorkSpace
# Register your models here.


class AdminWorkSpace(admin.ModelAdmin):
    list_filter = ['workpages']

admin.site.register(WorkSpace, AdminWorkSpace)