import {
  BufferGeometry,
  Float32BufferAttribute,
  OrthographicCamera
} from 'three';

const fullscreenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

const fullscreenTriangle = new BufferGeometry;

fullscreenTriangle.setAttribute("position", new Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3));

fullscreenTriangle.setAttribute("uv", new Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2));
