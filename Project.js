//Create a .env file in the backend directory:
MONGO_URI=mongodb  //localhost:27017/cmsdb
//We have defined a contentSchema in models/contentModel.js:
const mongoose = require('mongoose');
const contentSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  });
  
  module.exports = mongoose.model('Content', contentSchema);
  Mongod
  mongo
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Content', contentSchema);
const Content = require('../models/contentModel');

exports.getContents = async (req, res) => {
  try {
    const contents = await Content.find();
    res.json(contents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createContent = async (req, res) => {
  const content = new Content({
    title: req.body.title,
    body: req.body.body,
    author: req.body.author,
  });

  try {
    const newContent = await content.save();
    res.status(201).json(newContent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: 'Content not found' });

    content.title = req.body.title || content.title;
    content.body = req.body.body || content.body;
    content.author = req.body.author || content.author;

    const updatedContent = await content.save();
    res.json(updatedContent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: 'Content not found' });

    await content.remove();
    res.json({ message: 'Content deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

router.get('/', contentController.getContents);
router.post('/', contentController.createContent);
router.put('/:id', contentController.updateContent);
router.delete('/:id', contentController.deleteContent);

module.exports = router;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const contentRoutes = require('./routes/contentRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/contents', contentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
MONGO_URI=mongodb://localhost:27017/cmsdb
{
  "name": "cms-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "mongoose": "^5.12.14"
  },
  "devDependencies": {
    "nodemon": "^2.0.7"
  }
}
Frontend (frontend/cms-frontend directory)
//Create Angular Project
npx @angular/cli new cms-frontend --routing --style=css
cd cms-frontend
ng serve
//Generate Content Component
//ng generate component content
//Create Content Service
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Content {
  _id: string;
  title: string;
  body: string;
  author: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = 'http://localhost:5000/api/contents';

  constructor(private http: HttpClient) { }

  getContents(): Observable<Content[]> {
    return this.http.get<Content[]>(this.apiUrl);
  }

  createContent(content: Content): Observable<Content> {
    return this.http.post<Content>(this.apiUrl, content);
  }

  updateContent(content: Content): Observable<Content> {
    return this.http.put<Content>(`${this.apiUrl}/${content._id}`, content);
  }

  deleteContent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
//Update Content Component
import { Component, OnInit } from '@angular/core';
import { ContentService, Content } from './content.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  contents: Content[] = [];

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    this.contentService.getContents().subscribe(contents => {
      this.contents = contents;
    });
  }
}
Update src/app/content/content.component.html:
<div *ngFor="let content of contents">
  <h2>{{ content.title }}</h2>
  <p>{{ content.body }}</p>
  <p>Author: {{ content.author }}</p>
  <p>Date: {{ content.date | date }}</p>
  <hr>
</div>
//Add HttpClientModule
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentComponent } from './content/content.component';

@NgModule({
  declarations: [
    AppComponent,
    ContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

  

