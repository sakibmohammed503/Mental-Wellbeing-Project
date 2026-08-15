// Function that mimics your Machine Learning Model logic
function predictMentalWellbeing(userData) {
    // Check key risk factors based on ML features
    if (
        userData.social_media_hours > 8 ||
        userData.sleep_hours < 5 ||
        userData.digital_addiction_score > 30 ||
        userData.late_night_usage === "Often"
    ) {
        return "High Risk";
    } else {
        return "Low Risk";
    }
}