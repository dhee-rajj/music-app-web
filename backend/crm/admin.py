from django.contrib import admin
from .models import Ticket

class TicketAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'issue', 'is_solved')
    search_fields = ('user__username', 'issue', 'response')
    list_filter = ('is_solved', 'date')
    readonly_fields = ('date',)

admin.site.register(Ticket, TicketAdmin)