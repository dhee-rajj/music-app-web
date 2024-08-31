import graphene
from graphene_django import DjangoObjectType
from graphql_auth.schema import UserQuery, MeQuery
from graphql_auth import mutations
from crm.models import Ticket
from users.models import ExtendUser
class CustomUserType(DjangoObjectType):
    class Meta:
        model = ExtendUser

class TicketType(DjangoObjectType):
    class Meta:
        model = Ticket
    
    user = graphene.Field(CustomUserType)

    def resolve_user(self, info):
        return self.user

class Query(UserQuery, MeQuery, graphene.ObjectType):
    all_tickets = graphene.List(TicketType)

    def resolve_all_tickets(self, info):
        return Ticket.objects.all()

class CreateTicket(graphene.Mutation):
    ticket = graphene.Field(TicketType)

    class Arguments:
        issue = graphene.String(required=True)

    def mutate(self, info, issue):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Not logged in!")
        ticket = Ticket(user=user, issue=issue)
        ticket.save()
        return CreateTicket(ticket=ticket)

class RespondTicket(graphene.Mutation):
    ticket = graphene.Field(TicketType)

    class Arguments:
        ticket_id = graphene.ID(required=True)
        response = graphene.String(required=True)
        is_solved = graphene.Boolean()

    def mutate(self, info, ticket_id, response, is_solved=False):
        ticket = Ticket.objects.get(id=ticket_id)
        ticket.response = response
        ticket.is_solved = is_solved
        ticket.save()
        return RespondTicket(ticket=ticket)

class Mutation(graphene.ObjectType):
    create_ticket = CreateTicket.Field()
    respond_ticket = RespondTicket.Field()
    register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    token_auth = mutations.ObtainJSONWebToken.Field()
    refresh_token = mutations.RefreshToken.Field()
    revoke_token = mutations.RevokeToken.Field()
    send_password_reset_email = mutations.SendPasswordResetEmail.Field()
    password_reset = mutations.PasswordReset.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)