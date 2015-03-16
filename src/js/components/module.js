/** @jsx React.DOM */
var React = require('react');

var Module = React.createClass({

	render: function() {
		console.log('Rendering module with props', this.props);

		if (this.props.module.questions) {
			return (
				<div>
					<h2>{this.props.module.name}</h2>
					{this.props.module.questions.map(function(question, index) {
						return (<h4 key={index}>{question.name}</h4>)
					})}
				</div>
			);
		} else {
			return(
				<div>
					<h2>{this.props.module.name}</h2>
				</div>
			);
		}
	}
});

module.exports = Module;