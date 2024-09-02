import graphene
from graphene_django.types import DjangoObjectType
from .models import Contract
from .services import create_contract, generate_contract_terms
from player.models import Artist

class ContractType(DjangoObjectType):
    class Meta:
        model = Contract

class CreateContract(graphene.Mutation):
    contract = graphene.Field(ContractType)

    class Arguments:
        artist_id = graphene.ID(required=True)

    def mutate(self, info, artist_id):
        artist = Artist.objects.get(id=artist_id)
        terms = generate_contract_terms(artist)
        contract = create_contract(artist_id, terms)
        return CreateContract(contract=contract)

class Query(graphene.ObjectType):
    contracts = graphene.List(ContractType)

    def resolve_contracts(self, info):
        return Contract.objects.all()

class Mutation(graphene.ObjectType):
    create_contract = CreateContract.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)