import graphene
import player.schema
import users.schema

class Query(player.schema.Query, users.schema.Query, graphene.ObjectType):
    pass

class Mutation(player.schema.Mutation, users.schema.Mutation, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)