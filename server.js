const express = require(`express`);
const path = require(`path`);
const { writeFile, readFile, unlink } = require(`fs`);
const multer = require(`multer`);
const methodOverride = require('method-override');
const sql = require(`mysql2`);

const db = sql.createConnection({
    host:`localhost`,
    user:`root`,
    password:`AK19701970`,
    database:`resturantstats`
})

db.connect((err)=>{
    if(err){
        console.log(`error connecting to database`);
        
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, `src`),
    filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true })); 
server.use(methodOverride('_method'));
server.use(express.static(path.join(__dirname, `src`)));
server.use((req, res, next) => {
    console.log(`${req.method}, ${req.url}`);
    next();
});

server.get(`/`, (req, res) => {
    res.status(200).sendFile(path.join(__dirname, `index.html`));
});

server.get(`/postitem`, (req, res) => {
    res.status(200).sendFile(path.join(__dirname, `management.html`));
});

server.post(`/postitem`, upload.single(`image`), (req, res) => {
    console.log("POST /postitem hit");
    const { type, name, price } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(404).json({ success: false, message: `no image uploaded` });
    }

    const imagePath = `${file.filename}`;
    const newitem = { image: imagePath, name: name, price: price };

    readFile(path.join(__dirname, `src/items.json`), `utf8`, (err, data) => {
        if (err) return res.status(500).json({ success: false });

        let items;
        try {
            items = JSON.parse(data);
        } catch (nerr) {
            return res.status(500).json({ success: false });
        }

        if (!items[type]) items[type] = [];
        items[type].push(newitem);

        writeFile(path.join(__dirname, `src/items.json`), JSON.stringify(items, null, 2), err => {
            if (err) return res.status(500).json({ success: false });
            res.status(200).json({ success: true });
        });
    });
});

server.delete(`/postitem`, (req, res) => {
    const { deleted, deletedtype } = req.body;
    readFile(path.join(__dirname, `src/items.json`), `utf8`, (err, data) => {
        if (err) return res.status(500).json({ success: false });

        let items;
        let imgdel = [];

        try {
            items = JSON.parse(data);
        } catch (nerr) {
            return res.status(500).json({ success: false });
        }

        for (let i = 0; i < deletedtype.length; i++) {
            const type = deletedtype[i];
            const index = deleted[i];
            if (!items[type] || index >= items[type].length) continue;
            imgdel.push(items[type][index].image);
            items[type].splice(index, 1);
        }

        const deletePromises = imgdel.map(imgPath =>
            unlink(path.join(__dirname, `src`, imgPath), () => {})
        );

        Promise.all(deletePromises)
            .then(() => {
                writeFile(
                    path.join(__dirname, `src/items.json`),
                    JSON.stringify(items, null, 2),
                    err => {
                        if (err) return res.status(500).json({ success: false });
                        res.status(200).json({ success: true });
                    }
                );
            })
            .catch(() => {
                res.status(500).json({ success: false, message: 'Failed to delete images' });
            });
    });
});

server.put(`/postitem`, upload.single(`image-u`), (req, res) => {
    try {
        const { id, type, name, price } = req.body;
        const file = req.file;

        readFile(path.join(__dirname, `src/items.json`), `utf8`, (err, data) => {
            if (err) return res.status(404).json({ success: false });

            let item;
            try {
                item = JSON.parse(data);
            } catch (err) {
                return res.status(500).json({ success: false });
            }

            if (!item[type] || !item[type][id]) return res.status(400).json({ success: false, message: 'Invalid item' });
            
            if (file) {
                const imagepath = file.filename;
                unlink(path.join(__dirname, `src`, item[type][id].image), err => {
                    if (err) console.error('Image delete failed:', err);
                });
                item[type][id].image = imagepath;
            }

            item[type][id].name = name;
            item[type][id].price = price;

            writeFile(path.join(__dirname, `src/items.json`), JSON.stringify(item, null, 2), err => {
                if (err) return res.status(500).json({ success: false });
                res.json({ message: `updated` });
            });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

server.post(`/`,(req,res)=>{
    console.log(`data reseaved successfully`);
    const {ordername,orderprice} = req.body;
    for (let i = 0 ; i < ordername.length;i++){
        const pricen = Number(orderprice[i].slice(0,-1)).toFixed(2);
        db.query(`insert into costumers(order_name,price) values(?,?)`,[ordername[i],pricen],(err)=>{
            if (err){
                console.log(`error inserting data into the data base`,err);
                return res.status(500).json({success:false});
            }
        })
    }
    
})

server.get('/sales', (req, res) => {
  db.query('SELECT * FROM costumers', (err, result) => {
    if (err) return res.status(500).send('DB Error');

    const filePath = path.join(__dirname, 'sailes.html');
    readFile(filePath, 'utf8', (readErr, html) => {
      if (readErr) return res.status(500).send('Read Error');

      const injected = html.replace('</head>', `<script>const salesData = ${JSON.stringify(result)};</script></head>`);
      res.send(injected);
    });
  });
});

server.get(`/resturantexpanses`,(req,res)=>{
    const filepath = path.join(__dirname,`restcosts.html`);

    db.query(`select * from expenses`,(err,result)=>{
        
        readFile(filepath,`utf8`,(readerr,html)=>{
            if(readerr){
                console.log(`error reading file`,readerr);
                return res.status(500).json({success:false});
            }
            const injected = html.replace(`</head>`,`<script>const expensesData = ${JSON.stringify(result)};</script></head>`);
            
            res.status(200).send(injected);
        })
    })

})
server.post(`/resturantexpanses`,(req,res)=>{
    const {name,number,price} = req.body;
    db.query(`insert into expenses(item_name,item_number,item_cost) values(?,?,?)`,[name,number,price],(err)=>{
        if(err){
            console.log(`error in query`);
            return res.status(500).json({success:false});
        }
    })
})

server.listen(5000);
