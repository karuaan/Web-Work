const express = require('express');

app.use(express.static('dist'));

app.listen(4200, () => console.log('server running on 4200'));