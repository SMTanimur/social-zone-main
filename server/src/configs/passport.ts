
import LocalStrategy from 'passport-local';
import { IUser } from '../@types/user';
import User from '../apis/models/user';

export default function (passport) {
    passport.serializeUser(function (user: IUser, done: any) {
        done(null, user._id);
        console.log('SERIALIZE', user)
    });

    // used to deserialize the user
    passport.deserializeUser(function (id: string, done: any) {
        User.findById(id, function (err, user) {
            if (err) {
                console.log('ERR', err)
                return done(err);
            }
            done(err, user);
        });
    });

    // passport.use('local-register', new LocalStrategy.Strategy({
    //     // by default, local strategy uses username and password, we will override with email
    //     usernameField: 'email',
    //     passwordField: 'password',
    //     passReqToCallback: true // allows us to pass back the entire request to the callback
    // }, (req, email, password, done) => {
    //     User.findOne({ email })
    //         .then((user) => {
    //             if (user) {
    //                 return done(null, false, { message: 'Email has been already used by other user.' });
    //             } else {
    //                 const newUser = new User({ email, password, username: req.body.username });

    //                 newUser.save(function (err) {
    //                     if (err) {
    //                         return done(err);
    //                     }
    //                     return done(null, newUser);
    //                 });
    //             }
    //         })
    //         .catch((e) => {
    //             return done(e);
    //         })
    // })
    // );

    passport.use(
        'local',
        new LocalStrategy.Strategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        }, async (req, username, password, done) => {
            try {
                const user = await User.findOne({ username });

                if (user) {
                    user.passwordMatch(password, function (err, match) {
                        if (err) {
                            return done(err);
                        }
                        if (match) {
                            
                            return done(null, user);
                        } else {
                            return done(null, false, {
                                message: 'Incorrect credentials.'
                            });
                        }
                    });
                } else {
                    return done(null, false, { message: 'Incorrect credentials.' });
                }
            } catch (err) {
                return done(err);
            }
        })
    );


};
