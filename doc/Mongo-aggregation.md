# MongoDB Aggregation Pipeline

## To test this pipeline, we need to creat a database in MongoDB and then connect with it and then create a database collection and insert some data into the collection. like `aggre` is the database name and `users` is the collection name in my case. And also need to install a extension called `mongodb` in vscode. And then connect the extension with the database and collection with help of mongodb connection string.

## Now lets conclude all the concept with help of some steps. Which are listed below.

### Step 1:

- Get some dummy data like `authors` and `books` and insert into the database collection.(Here a link for dummy data is given below)
- [Dummy Data](https://gist.github.com/hiteshchoudhary/a80d86b50a5d9c591198a23d79e1e467)
- A small segment of the dummy data is given below.
  ```
    {
        "_id": {
            "$oid": "674f3e5d8d27ff10f0fefaf5"
        },
        "index": 0,
        "name": "Aurelia Gonzales",
        "isActive": false,
        "registered": {
            "$date": "2015-02-11T04:22:39Z"
        },
        "age": 20,
        "gender": "female",
        "eyeColor": "green",
        "favoriteFruit": "banana",
        "company": {
            "title": "YURTURE",
            "email": "aureliagonzales@yurture.com",
            "phone": "+1 (940) 501-3963",
            "location": {
            "country": "USA",
            "address": "694 Hewes Street"
            }
        },
        "tags": [
            "enim",
            "id",
            "velit",
            "ad",
            "consequat"
        ]
    }
  ```

### Step 2:

- Now we need to insert dummy data into the database collection with help of vs code mongo extension.
- To insert data into the database collection, we need to use the `insertMany` method. just right click on the collection name and select `insertMany` method and in the method we can add the data in a array format. And then press the play button on vs code extension to insert the data into the database collection.
- All data is reflect in the database collection.

### Step 3:

- To use aggregation pipeline, we need to use the `aggregate` method like `db.collection.aggregate([{pipeline1 or stage1}, {pipeline2 or stage2}, {pipeline3 or stage3}, ...])`.
- data filter in stage1 is the source for the data in stage2. data filter in stage2 is the source for the data in stage3. data filter in stage3 is the source for the data in stage4 and so on.
- Lets do some stages to test in mongo db website useing aggregation.

### Step 4:

- Lets filter the user data from the collection like select all user which are active. To solve this let use the stage1 pipeline.
- To achive this we need to use the `$match` operator like `[{ $match: { isActive: true } }]`. And it will automaically show the user which are active.

### Step 5:

- Now lets count the number of user which are active. To solve this let use the stage2 pipeline.
- To achive this we need to use the `$count` operator like `[{ $count: "activeUser" }]`. And it will automaically show the number of user which are active. And the name of the count variable is `activeUser`.

### Step 6:

- Now lets group the user data by their gender. To solve this we need to use `$group` operator like `[{ $group: { _id: "$gender" } }]`. Then it will automaically group the user data by their gender. And the name of the group variable is `_id`.
- Now lets calculate the average age of user which are active. To solve this let use the pipeline.
- To achive this first we need to use the `$group` operator to just group the user data by their age like `[{ $group: { _id: null } }]`. Then we use the `$avg` operator to calculate the average age of the user based on their age and set the average into a variable like `averageAge` like `[{ $group: { _id: null, averageAge: { $avg: "$age" } } }]`. We use null in `_id` so that there is no multiple grouping.

### Step 7:

- Now lets list top 5 favourite frutes among the users.
- To achive this, first we need to use `$group` operator to group the data by the `favoriteFruit` like `[{ $group: { _id: "$favoriteFruit" } }]`. Then we need to count how many user have a perticular favourite fruit like if a user like banana then add 1 to count and then if we get another use who also like banana then we need to increment the count by 1. For this we need to use first pipeline or stage like `{ $group: { _id: "$favoriteFruit", count: { $sum: 1 } } }`
- Now let sort the grouping data by the count in descending order in second pipeline or stage like `[{stage1},{ $sort: { count: -1 } }]`.
- Now lets limit the data to top 5 favourite frutes among the users in third pipeline or stage like `[{stage1},{stage2}, { $limit: 5 }]`.

### Step 8:

- Now lets find the total number of males and females in the database collection. To solve this let use the pipeline.
- To achive this we need to use `$group` operator and inside it first we need to set the `_id` to the `$gender` like `[{ $group: { _id: "$gender" } }]`. Then we need to count the number of users in each gender like `[{ $group: { _id: "$gender", count: { $sum: 1 } } }]`.

### Step 9:

- Now lets find which country has the highest number of registerd users from the database collection. To solve this let use the pipeline.
- First when we study the data we find that the country is not direct field inside the database. To access the county we first go to `company` object and then go to `location` and then we get `country` so to access it we we use like `$company.location.country`.
- Now in the first pipeline or stage we should group the dataset with help of the country like `[{ $group: { _id: "$company.location.country" } }]`. and then we need to use `$sum` to calculate the number of users in each country like `[{ $group: { _id: "$company.location.country", count: { $sum: 1 } } }]`. It will create a new field called `count` which will store the number of users in each country.
- In the second stage we to sort the data by the count in descending order like `[{ $sort: { count: -1 } }]`. And then in the third stage we need to limit the data to top 1 country like `[{ $limit: 1 }]`.
- Now we get the country which has the highest number of users.

### Step 10:

- Now lets find the list of all unique eye colors present in the collection. To solve this let use the pipeline.
- We can get it by just useing `$group` operator with help of `$eyeColor` like `[{ $group: { _id: "$eyeColor" } }]`

### Step 11:

- Now lets find What is the average number of tags per user. To solve this let use the pipeline.
- We can solve in two ways one is useing `$unwind` and the other is `$addFields`.
- Let fist use the `$unwind` operator, For it first on the first pipeline or stage we need to unwind (Unwind is a command in MongoDB that splits an array field into multiple documents) the data with help of `tags` field like `[{ $unwind: "$tags" }]`.
- Then in the second pipeline we need to group the data with help of `_id` like `[{ $group: { _id: "$_id" } }]`. And add a field called `numberOfTags` with help of `$sum` like `[{ $group: { _id: "$_id", numberOfTags: { $sum: 1 } } }]`
- And finally in the third pipeline we need to calculate the average number of tags per user like `[{ $group: { _id: null, averageNumberOfTags: { $avg: "$numberOfTags" } } }]`. Now we have the average number of tags per user.
- Now lets use the `$addFields` operator to calculate the average number of tags per user.
- For it first on the first stage we need to use `$addFields` operator and create a new field called `numberOfTags` and then use `$size` operator to calculate the number of tags in the tags array like `[{ $addFields: { numberOfTags: { $size: "$tags" } } }]`. But here we also face a condition like if the tags array is empty for a perticular user then it will cause a issue so to solve it we need to use `$ifNull` operator like `[{ $addFields: { numberOfTags: { $size: { $ifNull: ["$tags", []] } } } }]`. `$ifNull` operator will return the first argument if it is not null otherwise it will return the second argument.
- Now in the second stage we need to group the filter data with help of `$group` with no multiple data and also create a field called `averageNumberOfTags` with help of `$avg` like `{ $group: { _id: null, averageNumberOfTags: { $avg: "$numberOfTags" } } }`. It will calculate the average number of tags per user.

### Step 12:

- Now lets find how many users have 'enim' as one of their tags. To solve this let use the pipeline.
- We can solve it by useing `$match` operator with help of `tags` field like `[{ $match: { tags: "enim" } }]`. It will match the data which have `enim` as one of their tags.This is stage one where we can filter all user which has `enim` as one of their tags.
- In the second stage we need to count the user which has `enim` as one of their tags like `[{ $count: "userWithEnimTag" }]`. It will count the user which has `enim` as one of their tags.

### Step 13:

- Now lets find What are the names and age of users who are inactive and have `velit` as a tag. To solve this let use the pipeline.
- First we need to use `$match` operator with help of `isActive` field as false and `tags` field as `velit` like `[{ $match: { isActive: false, tags: "velit" } }]`. It will match the data which have `velit` as one of their tags and also inactive users.
- Now in the second stage we need to project the data with help of `name` and `age` field like `[{ $project: { name: 1, age: 1 } }]`. It will project the data which have `name` and `age` field.

### Step 14:

- Now lets find How many user have a phone number starting with `+1 (940)`. To solve this let use the pipeline.
- In the first stage we need to use `$match` operator with help of `phone` field like `[{ $match: { phone: /^\+1 \(940\)/ } }]`. It will match the data which have phone number starting with `+1 (940)`.
- In the second stage we need to count the data like `[{ $count: "userWithSpecialPhoneNo" }]`. It will count the data which have phone number starting with `+1 (940)`.

### Step 15:

- Now lets find Who has registered the most recently. To solve this let use the pipeline.
- First we need to use `$sort` operator with help of `registered` field of the data in descending order like `[{ $sort: { registered: -1 } }]`. It will sort the data by the `registered` field in descending order.
- Now in the second stage we need to limit the data to top 3 most recently registered users like `[{ $limit: 3 }]`. It will limit the data to top 3 most recently registered users.
- And finally in the third stage we need to project the data with help of `registered` and `name` field like `[{ $project: { registered: 1, name: 1 } }]`. It will project the data which have only `registered` and `name` field.

### Step 16:

- Now lets Categorize the users based on their favorite fruit. To solve this let use the pipeline.
- In the first pipeline we need to group the data based on the `favoriteFruit` field like `[{ $group: { _id: "$favoriteFruit" } }]`. It will group the data based on the `favoriteFruit` field.
- And then add a field called `users` where we need to push the `$name` of the user into the `users` array like `[{ $group: { _id: "$favoriteFruit", users: { $push: "$name" } } }]`. It will add the `$name` of the user into the `users` array.

### Step 17:

- Now lets find How many users have 'ad' as the second tag in their list of tags. To solve this let use the pipeline.
- To solve it first in the first stage we need to use `$match` operator with help of `tag.1` field becaues `tag` is an array and `tag.1` is the second tag of the user like `[{ $match: { "tag.1": "ad" } }]`. It will match the data which have 'ad' as the second tag in their list of tags.
- Now in the second stage we need to count the data like `[{ $count: "userWithSecondTagAd" }]`. It will count the data which have 'ad' as the second tag in their list of tags.

### Step 18:

- Now lets find the users who have both 'enim' and 'id' as their tags. To solve this let use the pipeline.
- To solve it first in the first stage we need to use `$match` operator with help of `tags` field and use `$all` operator with help of `enim` and `id` like `[{ $match: { tags: { $all: ["enim", "id"] } } }]`. It will match the data which have both 'enim' and 'id' as their tags.

### Step 19:

- Now lets find and list all companies located in the USA with their corresponding user count. To solve this let use the pipeline.
- To solve it first in the first stage we need to use `$match` operator with help of `company.location.country` field as `USA` like `[{ $match: { "company.location.country": "USA" } }]`. It will match the data which are located in the USA.
- In the second stage we need to group the data based on the `company.title` and also count the user in each company with help of `$sum` operator like `[{ $group: { _id: "$company.title", userCount: { $sum: 1 } } }]`. It will group the data based on the `company.title` and also count the user in each company.

### Step 20:

- Now lets use one of the aggregation pipeline called `$lookup` operator to join the `authors` and `books` collections.
- For this first we need to set the `from` collection name which we want to link with the `books` collection, then we need to set `localField` to the field name of `books` which is same as the `foreignField` of `authors` collection. And finally we need to set the `as` to the name of the new collection which we want to create like `[{ $lookup: { from: "authors", localField: "author_id", foreignField: "_id", as: "author_details" } }]`. It will join the `authors` and `books` collections. and create a new field with name `author_details` which will contain the data of the `authors` collection.
- It will return or create a object for the `author_details` field with the data of the `authors` collection.
- If we need to access the data of the `author_details` field we need to access it with help of `author_details.0` because it will contain the data of the first author in the `author_details` field. But to avoid this we can use `$addFields` operator with help of `$first` operator like `[{ $addFields: { author_details: { $first: "$author_details" } } }]`. It will add a field called `author_details` with the data of the first author in the `author_details` field. But we also use `$arrayElemAt` operator in place of `$first` operator. It was more readable then `$first` operator. And it will code like `[{ $addFields: { author_details: { $arrayElemAt: ["$author_details", 0] } } }]`.
