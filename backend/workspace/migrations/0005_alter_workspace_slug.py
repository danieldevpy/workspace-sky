# Generated by Django 5.1.7 on 2025-03-25 18:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workspace', '0004_alter_workspace_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workspace',
            name='slug',
            field=models.SlugField(blank=True, null=True, unique=True),
        ),
    ]
