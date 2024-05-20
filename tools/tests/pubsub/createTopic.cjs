const { PubSub } = require('@google-cloud/pubsub');

const args = process.argv;
if(typeof args[2] !== "string")
	throw new Error(`TOPIC_NAME must be a string. Got "${typeof args[2]}"`)

class App {
	static async exec(topicName) {
		const pubsub = new PubSub()

		console.log(`Creating topic with name: ${topicName}`)
		await pubsub.createTopic(topicName)
			.catch((err) => {
				if(err.code === 6)
					console.log(`Topic with name "${topicName}" already exist, skiping!`)
			})
		console.log(`Topic ${topicName} created!`)
	}
}

App.exec(args[2])
