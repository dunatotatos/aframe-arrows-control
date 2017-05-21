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
        this.el.addEventListener('click', function () {
            var coordinates = data.to_move.getAttribute('position');
            coordinates.x += data.increment.x;
            coordinates.y += data.increment.y;
            coordinates.z += data.increment.z;
            data.to_move.setAttribute('position', coordinates);
        });
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
