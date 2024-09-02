from transformers import pipeline
from django.conf import settings
from .models import Contract
from player.models import Artist

def create_contract(artist_id, terms):
    artist = Artist.objects.get(id=artist_id)
    contract = Contract(artist=artist, terms=terms)
    contract.save()
    return contract

def generate_contract_terms(artist):
    prompt = f"The music app platform is providing the following contract rules for the artist named {artist.name}. The contract should include terms and conditions, payment details, and obligations of both parties."
    generator = pipeline('text-generation', model='gpt2')
    response = generator(prompt, max_length=500, num_return_sequences=1)
    generated_text = response[0]['generated_text'].strip()
    if generated_text.startswith(prompt):
        terms = generated_text[len(prompt):].strip()
    else:
        terms = generated_text
    return terms