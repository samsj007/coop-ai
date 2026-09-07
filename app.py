from flask import Flask, render_template, request
import joblib
import pandas as pd

app = Flask(__name__)
model = joblib.load("models/predictor.pkl")

@app.route("/", methods=["GET", "POST"])
def home():
    prediction = None
    seats_value = applications_value = None
    if request.method == "POST":
        data = {
            "applications": [float(request.form["applications"])],
            "seats": [float(request.form["seats"])],
            "placements_pct": [float(request.form["placements_pct"])],
            "ad_budget": [float(request.form["ad_budget"])],
            "courses": [float(request.form["courses"])],
            "annual_fees": [float(request.form["annual_fees"])],
            "last_year_admissions": [float(request.form["last_year_admissions"])],
        }
        df = pd.DataFrame(data)
        prediction = round(model.predict(df)[0])
        seats_value = int(request.form["seats"])
        applications_value = int(request.form["applications"])
        prediction = min(max(prediction, 0), seats_value)

    return render_template("index.html", prediction=prediction,
                            seats=seats_value, applications=applications_value)
if __name__ == "__main__":
    app.run(debug=True)