# Generated by Django 5.1.7 on 2025-03-28 15:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workpage', '0005_remove_workpage_workspaces'),
    ]

    operations = [
        migrations.AddField(
            model_name='workpage',
            name='group',
            field=models.CharField(default=1, max_length=200, verbose_name='Nome do agrupamento'),
            preserve_default=False,
        ),
    ]
