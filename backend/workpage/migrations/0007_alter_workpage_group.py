# Generated by Django 5.1.7 on 2025-03-28 15:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workpage', '0006_workpage_group'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workpage',
            name='group',
            field=models.CharField(blank=True, default='', max_length=200, null=True, verbose_name='Nome do agrupamento'),
        ),
    ]
