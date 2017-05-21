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
