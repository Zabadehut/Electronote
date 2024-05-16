from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

def get_video_info(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # S'assure que la requête s'est bien passée
    except requests.exceptions.RequestException as e:
        return {'error': f"Request failed: {e}"}

    soup = BeautifulSoup(response.text, 'html.parser')

    title_tag = soup.find('meta', property='og:title')
    description_tag = soup.find('meta', property='og:description')
    thumbnail_url_tag = soup.find('meta', property='og:image')

    title = title_tag['content'] if title_tag else 'No title found'
    description = description_tag['content'] if description_tag else 'No description found'
    thumbnail_url = thumbnail_url_tag['content'] if thumbnail_url_tag else 'No thumbnail found'

    return {
        'title': title,
        'description': description,
        'thumbnail_url': thumbnail_url
    }

@app.route('/scrape/', methods=['GET'])
def scrape():
    youtube_url = request.args.get('url')
    if not youtube_url:
        return jsonify({'error': 'URL parameter is missing'}), 400
    video_info = get_video_info(youtube_url)
    if 'error' in video_info:
        return jsonify(video_info), 500
    return jsonify(video_info)

if __name__ == '__main__':
    app.run(debug=True, port=5000)