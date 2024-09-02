from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Contract

class ContractAdmin(admin.ModelAdmin):
    list_display = ('artist', 'terms', 'signed_date')
    search_fields = ('artist__name', 'terms')

admin.site.register(Contract, ContractAdmin)