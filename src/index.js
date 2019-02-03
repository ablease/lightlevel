'use strict';

const appOpts = {
    dom: {
	body: document.querySelector('body'),
    },
};

const startAmbientSensor = () => {
    if ( 'AmbientLightSensor' in window ) {
	navigator.permissions.query({ name: 'ambient-light-sensor' })
	    .then(result => {
		if (result.state === 'denied') {
		    return;
		}
		// create a new abiemtnlightsensor and set frequency (seconds) it should record a sample
		const sensor = new AmbientLightSensor({frequency: 0.5});

		// when ambient lgiht level changes across certain values, toggle a dom object.
		sensor.addEventListener('reading', () => {
		    if (sensor['illuminance'] < 3 && !appOpts.dom.body.classList.contains('dark')) {
			appOpts.dom.body.classList.toggle('dark');
		    } else if (sensor['illuminance'] > 3 && appOpts.dom.body.classList.contains('dark')) {
			appOpts.dom.body.classList.toggle('dark');
		    };
		});
		sensor.start();
	    })
    }
}

startAmbientSensor();

if ( 'AmbientLightSensor' in window ) {
    const sensor = new AmbientLightSensor();
    sensor.onreading = () => {
	console.log('Current light level:', sensor.illuminance);
	document.getElementById('readout').textContent = sensor.illuminance;
    };
    sensor.onerror = (event) => {
	console.log(event.error.name, event.error.message);
    };
    sensor.start();
}
