import requests
from twilio.rest import Client

# Remplacez ces valeurs par vos informations d'authentification Twilio
TWILIO_ACCOUNT_SID = "ACcc55629a648cc67223483de9fab5aae6"
TWILIO_AUTH_TOKEN = "92ac3be3d8c5c97f4b42894438e70b44"
TWILIO_PHONE_NUMBER = "+18789004392"
YOUR_PHONE_NUMBER = "+33767028392"

# Fonction pour récupérer les informations de match à partir de l'API
def get_player_matches(player):
    url = f"https://tennisapi1.p.rapidapi.com/api/tennis/calendar/7/2022"
    headers = {
        "X-RapidAPI-Key": "a308d95a41msh08b6eb65209d1f0p1d7636jsn440e6661ccc0",
        "X-RapidAPI-Host": "tennisapi1.p.rapidapi.com"
    }
    response = requests.get(url, headers=headers)
    calendar_data = response.json()
    player_matches = [match for match in calendar_data if player.lower() in match['player1']['name'].lower()]
    return player_matches

# Fonction pour envoyer un SMS avec les détails du match
def send_match_details(match):
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    message_body = (
        f"Prochain match de {match['player1']['name']} :\n"
        f"Date: {match['date']}\n"
        f"Heure: {match['time']}\n"
        f"Adversaire: {match['player2']['name']}\n"
        f"Tournoi: {match['tournament']['name']}\n"
        f"Chaîne de diffusion: {match['tvchannels'][0]['name']}"
    )
    message = client.messages.create(
        body=message_body,
        from_=TWILIO_PHONE_NUMBER,
        to=YOUR_PHONE_NUMBER
    )

def main():
    player = input("Entrez le nom du joueur de tennis que vous souhaitez suivre : ")
    player_matches = get_player_matches(player)
    if player_matches:
        next_match = player_matches[0]  # Obtenir le prochain match du joueur
        send_match_details(next_match)
    else:
        print(f"Aucun match trouvé pour le joueur {player} dans le calendrier.")

if __name__ == "__main__":
    main()
