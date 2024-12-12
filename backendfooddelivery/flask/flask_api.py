from flask import Flask, jsonify
import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from flask_cors import CORS 
app = Flask(__name__)
CORS(app) 
# Static path to the CSV file
CSV_FILE_PATH = 'C:/Users/Harshvir/OneDrive/Desktop/SIH/backendfooddelivery/controllers/exports/products.csv'

@app.route('/predict', methods=['GET'])
def predict():
    try:
        print("Starting prediction process...")

        # Load the static CSV file into a DataFrame
        df = pd.read_csv(CSV_FILE_PATH)

        # Convert 'date' to datetime
        df['date'] = pd.to_datetime(df['date'])

        # Create a year_month column for aggregation
        df['year_month'] = df['date'].dt.to_period('M')

        # Aggregate data by userId and year_month, summing all numeric columns dynamically
        numeric_columns = df.select_dtypes(include=np.number).columns.tolist()
        df_grouped = df.groupby(['userId', 'year_month'])[numeric_columns].sum().reset_index()

        # Create predictions for each user
        predictions = {}

        medicine_columns = df_grouped.columns[2:].tolist()  # All columns except the first two

        for user in df_grouped['userId'].unique():
            user_data = df_grouped[df_grouped['userId'] == user]

            if user_data.empty:
                continue

            user_predictions = {}

            for medicine in medicine_columns:
                y = user_data.set_index('year_month')[medicine].astype(float)

                if y.isnull().all() or len(y) < 2:
                    print(f"Skipping user {user} for medicine {medicine}: not enough data")
                    continue

                try:
                    model = ARIMA(y, order=(1, 1, 1))
                    model_fit = model.fit()

                    # Forecast the next month
                    forecast = model_fit.forecast(steps=1)
                    user_predictions[medicine] = int(round(forecast[0]))
                except Exception as e:
                    print(f"Error fitting model for user {user}, medicine {medicine}: {e}")

            if user_predictions:
                predictions[user] = user_predictions

        return jsonify(predictions)  # Return predictions as JSON

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
