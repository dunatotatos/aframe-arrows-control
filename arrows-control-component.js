// This component adds arrows to move the camera when an arrow is clicked.
// The arrwos move with the camera itself
// positions are the positions of the arrow in camera coordinates (the axes
// does not rotate with the camera
// The number of elements in positions is the number of directional arrows.
// increment_factor is a speed factor to set how much the camera moves after
// in the direction of the clicked arrow. !! Changing the positions attribute
// can also change the speed of the camera !!
AFRAME.registerComponent('arrows-control', {
    schema: {
        'positions': {
            'type': 'array',
            'default': [
                {'x':  1, 'y':  0, 'z':  0},
                {'x': -1, 'y':  0, 'z':  0},
                {'x':  0, 'y':  0, 'z':  1},
                {'x':  0, 'y':  0, 'z': -1},
            ]
        },
        'increment_factor': {
            'type': 'int',
            'default': 1
        }
    },
    init: function () {

        // Init vars
        var up_vector = new THREE.Vector3(0, 1, 0);
        var front_vector = new THREE.Vector3(1, 0, 0);

        // Create main platform to support arrows
        this.navigation_arrows = document.createElement('a-entity');
        this.navigation_arrows.setAttribute('follow-position',
            {
                'to_follow': this.el,
                'distance': {'x': 0, 'y': -1, 'z': 0},
            }
        );

        // Create all the arrows and attach to the platform
        var count_arrows = this.data.positions.length;
        for(var i = 0; i < count_arrows; i++) {
            // Init vars
            var position = this.data.positions[i];
            var increment = {};
            var rotation = new THREE.Vector3();

            // Create arrow
            var arrow = document.createElement('a-entity');

            // Set position
            arrow.setAttribute('position', position);

            // Set rotation
            var position_unit = new THREE.Vector3(position.x, position.y, position.z).normalize();
            var equatorial_position_unit = new THREE.Vector3(position_unit.x, 0, position_unit.z).normalize();
            // Latitude
            rotation.z = -up_vector.angleTo(position_unit)/Math.PI*180;
            // Longitude
            rotation.y = front_vector.angleTo(equatorial_position_unit)/Math.PI*180;;
            if (! rotation.y) {
                //equatorial_position_unit was 0 0 0, no need to rotate
                rotation.y = 0;
            }
            if (position_unit.z > 0) {
                rotation.y = 360 - rotation.y;
            }
            arrow.setAttribute('rotation', rotation);

            // Set geometry and material
            arrow.setAttribute('geometry', {
                'primitive': 'cone',
                'height': 0.5,
                'openEnded': false,
                'radiusBottom': 0.1,
                'radiusTop': 0,
            });
            arrow.setAttribute('material', {
                'opacity': 0.1,
                'transparent': true,
                'color': 'grey',
            });

            // Set increment
            for (key in position) {
                increment[key] = position[key] * this.data.increment_factor;
            }
            arrow.setAttribute('move_entity',
                {
                    'to_move': this.el,
                    'increment': increment
                }
            );

            // Add arrow to the platform
            this.navigation_arrows.appendChild(arrow);
        }

        // Add main platform to the scene
        this.el.sceneEl.appendChild(this.navigation_arrows);
    }
});

// This component creates an entity which changes the position of another
// entity when clicked
// to_move is the element to move when the entity is clicked
// increment is how much the to_move entity has to be moved
AFRAME.registerComponent('move_entity', {
    schema: {
        'to_move': {},
        'increment':
            {
                'type': 'vec3',
                'default': {x: 1, y: 0, z: 0}
            }
    },
    init: function () {
        var data = this.data;
        this.el.addEventListener('mouseenter', function () {
            this.setAttribute('hovered', true);
            this.setAttribute('scale', '1.2 1.2 1.2');
            this.setAttribute('material', 'opacity', 1);
        });
        this.el.addEventListener('mouseleave', function () {
            this.setAttribute('hovered', false);
            this.setAttribute('scale', '1 1 1');
            this.setAttribute('material', 'opacity', 0.1);
        });
        this.tick = AFRAME.utils.throttleTick(this.throttledTick, 100, this);
    },
    throttledTick: function () {
        if (this.el.getAttribute('hovered') == "true") {
            var coordinates = this.data.to_move.getAttribute('position');
            coordinates.x += this.data.increment.x;
            coordinates.y += this.data.increment.y;
            coordinates.z += this.data.increment.z;
            this.data.to_move.setAttribute('position', coordinates);
        }
    }
});

// This component creates an entity which follows the camera position but not
// his rotation.
// to_follow attribute is the element to follow
// distance attribute is added to followed position
AFRAME.registerComponent('follow-position', {
    schema: {
        'to_follow': {},
        'distance':
            {
                'type': 'vec3',
                'default': {x: 0, y: -1.6, z: 0}
            }
    },
    tick: function () {
        var camera_position = this.data.to_follow.getAttribute('position');
        camera_position.x += this.data.distance.x;
        camera_position.y += this.data.distance.y;
        camera_position.z += this.data.distance.z;
        this.el.setAttribute('position', camera_position);
    }
});
