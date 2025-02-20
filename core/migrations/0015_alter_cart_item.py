# Generated by Django 5.1 on 2025-02-19 19:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0014_remove_cart_session_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cart',
            name='item',
            field=models.ManyToManyField(blank=True, null=True, through='core.CartItem', to='core.product'),
        ),
    ]
