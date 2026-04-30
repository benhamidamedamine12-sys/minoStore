const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

const backendUrl =
  process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5500}`;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${backendUrl}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
          // Créer un nouvel utilisateur
          user = new User({
            name: profile.name.givenName || profile.displayName.split(" ")[0],
            lastName: profile.name.familyName || profile.displayName.split(" ")[1] || "",
            email: email,
            password: Math.random().toString(36).slice(-16), // mot de passe aléatoire
            phone: "Non renseigné", // pourra être complété plus tard
            emailVerified: true,
            image: profile.photos?.[0]?.value || "assets/picture.png",
          });
          await user.save();
        } else {
          // Si l'utilisateur existe mais n'a pas d'email vérifié, on le vérifie
          if (!user.emailVerified) {
            user.emailVerified = true;
            await user.save();
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Sérialisation pour la session (obligatoire)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
