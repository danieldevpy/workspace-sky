from django.contrib import admin
from .models import WorkPage


class AdminWorkPage(admin.ModelAdmin):
    list_filter = ['workspace']
    pass

admin.site.register(WorkPage, AdminWorkPage)