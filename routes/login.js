exports.login = function(req, res) {
    const cookie = req.session.data;
    return res.render('login', { cookie });
};

// danny.glazovs@gmail.com
// 3031190977d