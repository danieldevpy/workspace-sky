# Generated by Django 5.1.7 on 2025-03-26 19:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workpage', '0004_remove_workpage_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='workpage',
            name='workspaces',
        ),
    ]
