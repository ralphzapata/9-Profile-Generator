const fs = require("fs");
const pdf = require("html-pdf");
const axios = require("axios");
const inquirer = require("inquirer");

const colors = {
	green: {
		wrapperBackground: "#E6E1C3",
		headerBackground: "#C1C72C",
		headerColor: "black",
		photoBorderColor: "black"
	},
	blue: {
		wrapperBackground: "#5F64D3",
		headerBackground: "#26175A",
		headerColor: "white",
		photoBorderColor: "#73448C"
	},
	pink: {
		wrapperBackground: "#879CDF",
		headerBackground: "#FF8374",
		headerColor: "white",
		photoBorderColor: "#FEE24C"
	},
	red: {
		wrapperBackground: "#DE9967",
		headerBackground: "#870603",
		headerColor: "white",
		photoBorderColor: "white"
	}
};

inquirer
	.prompt([
		{
			message: "Enter your GitHub username:",
			name: "username"
		},
		{
			message: "Do you have a favorite color?",
			type: "list",
			name: "color",
			choices: ["green", "blue", "pink", "red"]
		}
	])
	.then(function({ username, color }) {
		console.log(username);
		const queryURL = `https://api.github.com/users/${username}`;
		const starURL = `https://api.github.com/users/${username}/starred`;
		console.log(color);

		axios.get(starURL).then(function(res) {
			let gitStar = res.data.length;
			axios.get(queryURL).then(function(res) {
				const user = res.data;
				const newhtml = res.data.login + ".html";
				console.log(color);

				const locationURL = user.location
					.replace(/[,]/g, "+")
					.replace(/[ ]/g, "");
				console.log(locationURL);

				function generateHTML(data) {
					return `<!DOCTYPE html>
				<html lang="en">
				   <head>
					  <meta charset="UTF-8" />
					  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
					  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
					  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
					  <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
					  <title>Document</title>
					  <style>
						  @page {
							margin: 0;
						  }
						 *,
						 *::after,
						 *::before {
						 box-sizing: border-box;
						 }
						 html, body {
						 padding: 0;
						 margin: 0;
						 }
						 html, body, .wrapper {
						 height: 100%;
						 }
						 .wrapper {
						 background-color: ${colors[color].wrapperBackground};
						 padding-top: 100px;
						 }
						 body {
						 background-color: white;
						 -webkit-print-color-adjust: exact !important;
						 font-family: 'Cabin', sans-serif;
						 }
						 main {
						 background-color: #E9EDEE;
						 height: auto;
						 padding-top: 30px;
						 }
						 h1, h2, h3, h4, h5, h6 {
						 font-family: 'BioRhyme', serif;
						 margin: 0;
						 }
						 h1 {
						 font-size: 3em;
						 }
						 h2 {
						 font-size: 2.5em;
						 }
						 h3 {
						 font-size: 2em;
						 margin-top: 10px;
						 }
						 h4 {
						 font-size: 1.5em;
						 }
						 h5 {
						 font-size: 1.3em;
						 }
						 h6 {
						 font-size: 1.2em;
						 }
						 .photo-header {
						 position: relative;
						 margin: 0 auto;
						 margin-bottom: -50px;
						 display: flex;
						 justify-content: center;
						 flex-wrap: wrap;
						 background-color: ${colors[color].headerBackground};
						 color: ${colors[color].headerColor};
						 padding: 10px;
						 width: 95%;
						 border-radius: 6px;
						 }
						 .photo-header img {
						 width: 250px;
						 height: 250px;
						 border-radius: 50%;
						 object-fit: cover;
						 margin-top: -75px;
						 border: 6px solid ${colors[color].photoBorderColor};
						 box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
						 }
						 .photo-header h1, .photo-header h2 {
						 width: 100%;
						 text-align: center;
						 }
						 .photo-header h1 {
						 margin-top: 10px;
						 }
						 .links-nav {
						 width: 100%;
						 text-align: center;
						 padding: 20px 0;
						 font-size: 1.1em;
						 }
						 .nav-link {
						 display: inline-block;
						 margin: 5px 10px;
						 }
						 .workExp-date {
						 font-style: italic;
						 font-size: .7em;
						 text-align: right;
						 margin-top: 10px;
						 }
						 .container {
						 padding: 10px;
						 }
				
						 .row {
						   display: flex;
						   flex-wrap: wrap;
						   justify-content: space-between;
						   margin-top: 20px;
						   margin-bottom: 20px;
						 }
				
						 .card {
						   padding: 20px;
						   border-radius: 6px;
						   background-color: ${colors[color].headerBackground};
						   color: ${colors[color].headerColor};
						   margin: 20px;
						 }
						 
						 .col {
						 flex: 1;
						 text-align: center;
						 }
				
						 a, a:hover {
						 text-decoration: none;
						 color: inherit;
						 font-weight: bold;
						 }
				
						 @media print { 
						  body { 
							zoom: .75; 
						  } 
						 }
					  </style>
					  <body class="wrapper">
					<header>
						<div class="container">
							<div class="row">
								<div class="col">
									<div class="photo-header">
										<img src="${user.avatar_url}" alt="profile-pic">
										<h1>Hi!</h1>
										<h2>My name is ${user.name}</h2>
										<h4>Currently @ ${user.company}</h4>
										<div class="links-nav">
											<div class="nav-link">
												<a href="https://www.google.com/maps/search/?api=1&query=${locationURL}">
													<i class="fas fa-location-arrow"></i>
													<h6>${user.location}</h6>
												</a>
											</div>
											<div class="nav-link">
												<a href="${user.url}">
													<i class="fab fa-github-alt"></i>
													<h6>Github</h6>
												</a>
											</div>
											<div>
												<a href="${user.blog}">
													<i class="fas fa-rss"></i>
													<h6>Blog</h6>
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</header>
				
					<main class="container">
						<div class="row">
							<div class="col">
								<h3>${user.bio}</h3>
							</div>
						</div>
						<div class="row">
							<div class="col">
								<div class="card">
									<h3>Public Repositories</h3>
									<h4>${user.public_repos}</h4>
								</div>
								<div class="card">
									<h3>GitHub Stars</h3>
									<h4>${gitStar}</h4>
								</div>
							</div>
							<div class="col">
								<div class="card">
									<h3>Following</h3>
									<h4>${user.following}</h4>
								</div>
								<div class="card">
									<h3>Followers</h3>
									<h4>${user.followers}</h4>
								</div>
							</div>
						</div>
					</main>			
				</body>`;
				}

				fs.writeFile(
					newhtml,
					generateHTML({ ...user, ...gitStar, ...{ colors } }),
					function(err) {
						if (err) throw err;
						console.log(`Wrote ${user.login}.html`);

						const html = fs.readFileSync("./" + newhtml, "utf8", function(
							err,
							data
						) {
							if (err) throw err;
						});
						const options = { format: "Letter", timeout: 30000 };

						pdf
							.create(html, options)
							.toFile(`./${user.login}.pdf`, function(err, res) {
								if (err) throw err;
								console.log("PDF created!");
							});
					}
				);
			});
		});
	});

