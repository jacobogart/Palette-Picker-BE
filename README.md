# Palette-Picker-BE
![TravisCI Bage](https://travis-ci.org/jacobogart/Palette-Picker-BE.svg?branch=master)

#### By [Bridgett Coyle](https://github.com/B-Coyle) & [Jacob Bogart](https://github.com/jacobogart)

A RESTful API built with Express and Knex to support the PalettePicker Front-End UI.

## Documentation

(Deployed at https://palette-picker-jbbc.herokuapp.com)

### List All Projects

`GET /api/v1/projects`

#### Paramenters

| Name         | Type    | Description                             |
| ------------ |---------| ------------                            |
| `name`       | `string`| Search projects by name (case-sensitive)|

#### Sample Response 
```
Status: 200 OK
```
```
[
	{
		id: 1,
		project_name: "My First Project",
		created_at: "2019-07-02T23:49:14.977Z",
		updated_at: "2019-07-02T23:49:14.977Z"
	},
	{
		id: 2,
		project_name: "My Second Project",
		created_at: "2019-07-02T23:49:14.997Z",
		updated_at: "2019-07-02T23:49:14.997Z"
	},
	...
]
```

### List All Palettes

`GET /api/v1/palettes`

#### Paramenters
 
| Name         | Type     | Description                                |
| ------------ |--------- | ------------                               |
| `project_id` | `integer`| Search palettes by thier associated project|

#### Sample Response 
```
Status: 200 OK
```
```
[
	{
		id: 1,
		palette_name: "My First Palette",
		color1: "#d70693",
		color2: "#484336",
		color3: "#d28404",
		color4: "#ac0f0a",
		color5: "#c8aaed",
		project_id: 1,
		created_at: "2019-07-02T23:49:15.003Z",
		updated_at: "2019-07-02T23:49:15.003Z"
	},
	{
		id: 2,
		palette_name: "My Second Palette",
		color1: "#91e214",
		color2: "#84474c",
		color3: "#37fb59",
		color4: "#2eb501",
		color5: "#452a06",
		project_id: 1,
		created_at: "2019-07-02T23:49:15.010Z",
		updated_at: "2019-07-02T23:49:15.010Z"
	},
	...
]
```

### Get Project

`GET /api/v1/projects/:id`

#### Paramenters

None

#### Sample Response 
```
Status: 200 OK
```
 ```
{
	id: 1,
	project_name: "My First Project",
	created_at: "2019-07-02T23:49:14.977Z",
	updated_at: "2019-07-02T23:49:14.977Z"
}
```

### Get Palette

`GET /api/v1/palette/:id`

#### Paramenters

None

#### Sample Response 
```
Status: 200 OK
```
 ```
{
	id: 1,
	palette_name: "My First Palette",
	color1: "#d70693",
	color2: "#484336",
	color3: "#d28404",
	color4: "#ac0f0a",
	color5: "#c8aaed",
	project_id: 1,
	created_at: "2019-07-02T23:49:15.003Z",
	updated_at: "2019-07-02T23:49:15.003Z"
}
```

### Create Project

`POST /api/v1/project`

#### Input

| Name          | Type    | Description                         |
| ------------  |---------| ------------                        |
| `project_name`| `string`| Name of the project                 |

#### Sample Response 
```
Status: 201 Created
```
 ```
{
	id: 17
}
```

### Create Palette

`POST /api/v1/palettes`

#### Input

| Name          | Type     | Description             |
| ------------  |--------- | ------------            |
| `palette_name`| `string` | Name of the palette     |
| `color1`      | `string` | Six-digit hexcode       |
| `color2`      | `string` | Six-digit hexcode       |
| `color3`      | `string` | Six-digit hexcode       |
| `color4`      | `string` | Six-digit hexcode       |
| `color5`      | `string` | Six-digit hexcode       |
| `project_id`  | `integer`| ID of associated project|


#### Sample Response 
```
Status: 201 Created
```
 ```
{
	id: 32
}
```

### Update Project

`PUT /api/v1/project/:id`

#### Input

| Name          | Type    | Description                         |
| ------------  |---------| ------------                        |
| `project_name`| `string`| Name of the project                 |

#### Sample Response 
```
Status: 204 No Content
```

### Update Palette

`PUT /api/v1/palettes/:id`

#### Input

| Name          | Type     | Description             |
| ------------  |--------- | ------------            |
| `palette_name`| `string` | Name of the palette     |
| `color1`      | `string` | Six-digit hexcode       |
| `color2`      | `string` | Six-digit hexcode       |
| `color3`      | `string` | Six-digit hexcode       |
| `color4`      | `string` | Six-digit hexcode       |
| `color5`      | `string` | Six-digit hexcode       |
| `project_id`  | `integer`| ID of associated project|

#### Sample Response 
```
Status: 204 No Content
```

### Delete Project

`DELETE /api/v1/projects/:id`

#### Sample Response 
```
Status: 204 No Content
```
### Delete Palette

`DELETE /api/v1/palettes/:id`

#### Sample Response 
```
Status: 204 No Content
```

