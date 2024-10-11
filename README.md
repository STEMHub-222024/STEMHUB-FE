# Website STEM

## Using Technology

### **Frontend**

-   ReactJs
-   Redux, Redux-toolkit

### Backend

-   Asp.net core API
-   SQL Server

## Description

The site will primarily focus on helps high school students view steam topics in the current education system, allowing students to search for a specific topic and view the content of the lessons, as well as can manage personal information.

## Installation

### Step 1: [Clone project Font-End](https://github.com/STEMHub-222024/STEMHUB-FE.git)

### Step 2: [Clone project Back-End](https://github.com/STEMHub-222024/STEMHUB-BE.git)

### Step 3: Install Environment

1. [Node js](https://nodejs.org/dist/v10.16.3/node-v10.16.3-x64.msi).

### Step 4 - Edit content

1. Create file `.env or.env.development` add:

    REACT_APP_STEAM_BASE_URL="https://codefirst.id.vn/api/"
    REACT_APP_STEAM_DEV_URL="https://localhost:7204/api/"
    REACT_APP_STEAM_GEMINI_AI_KEY = "AIzaSyBirN5WDVYCBmj8sXKNAWp80qxJcEyq10c"

<!-- ![Open file](https://github.com/STEMHub-222024/STEMHUB-FE/assets/88336997/96a9d27e-79a8-4050-a1d1-68098fad179b) -->

2. Run `npm install `
3. Edit file `appsettings.json`
   ![Open file](https://github.com/Nvdqb73/barber-ui/assets/88336997/ddfb8b43-45dc-4041-822a-0c5859cd94a3)

### Step 3: On cmd screen

-   At the BE directory path: dotnet ef database update => Run `dotnet run`
-   At the BE directory path: Run `npm start`

## **Feature**

-   Login / Sign out
-   Search Topic & Post
-   Watching Topic & lesson

## Other

-   Interface Admin: https://github.com/STEMHub-222024/STEMHUB-BE/tree/master
