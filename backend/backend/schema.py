import graphene
import player.schema
import users.schema
import crm.schema

class Query(player.schema.Query, users.schema.Query, crm.schema.Query, graphene.ObjectType):
    pass

class Mutation(player.schema.Mutation, users.schema.Mutation, crm.schema.Mutation, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)