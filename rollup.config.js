export default {
  input: 'src/ecs.js',
  output: [
    {
      format: 'umd',
      name: 'ECS',
      file: 'build/ecs.js',
      indent: '\t'
    },
    {
      format: 'es',
      file: 'build/ecs.module.js',
      indent: '\t'
    }
  ],
  watch: {
    include: 'src/**'
  }
};