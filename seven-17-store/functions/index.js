const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

/**
 * A Firebase Function that triggers whenever a new review is created,
 * deleted, or updated.
 * It automatically recalculates the average rating and total review count
 * for the associated product and updates it in the 'products' collection.
 */
exports.updateProductRating = functions.firestore
    .document("reviews/{reviewId}")
    .onWrite(async (change, context) => {
      // Get the productId from the review document.
      // If the review was deleted, 'change.after.data()' won't exist,
      // so we get it from 'change.before.data()'.
      const data = change.after.exists ? change.after.data() : change.before.data();
      const productId = data.productId;

      if (!productId) {
        console.log("Review document is missing a productId. Exiting function.");
        return null;
      }

      console.log(`Recalculating rating for product: ${productId}`);

      // Get a reference to the product document in the 'products' collection.
      const productRef = db.collection("products").doc(productId);

      // Get all reviews for this specific product.
      const reviewsSnapshot = await db.collection("reviews")
          .where("productId", "==", productId)
          .get();

      if (reviewsSnapshot.empty) {
        // If there are no reviews left, reset the rating and reviews count to 0.
        console.log("No reviews found for this product. Resetting rating.");
        return productRef.update({
          rating: 0,
          reviews: 0,
        });
      }

      // Calculate the new average rating and total number of reviews.
      const totalReviews = reviewsSnapshot.size;
      let totalRating = 0;
      reviewsSnapshot.forEach((doc) => {
        totalRating += doc.data().rating;
      });

      const newAverageRating = totalRating / totalReviews;

      // Update the product document with the new values.
      console.log(`Updating product ${productId} with new rating: ${newAverageRating.toFixed(1)} and review count: ${totalReviews}`);
      return productRef.update({
        // We round to one decimal place for a cleaner display.
        rating: parseFloat(newAverageRating.toFixed(1)),
        reviews: totalReviews,
      });
    });
