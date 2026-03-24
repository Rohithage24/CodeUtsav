import re
import nltk
from nltk.corpus import stopwords

nltk.download('stopwords')

stop_words = set(stopwords.words('english'))

def clean_text(text):
    text = text.lower()

    # remove emojis, symbols
    text = re.sub(r'[^a-zA-Z\s]', ' ', text)

    words = text.split()

    # remove stopwords + small words
    words = [word for word in words if word not in stop_words and len(word) > 2]

    return " ".join(words)