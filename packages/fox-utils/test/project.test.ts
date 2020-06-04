import path from 'path'
import * as foxUtilsProjects from '../src/project'

describe('getProjectData()', () => {
  test('correct package contents at project root', async () => {
    const spy = jest.spyOn(process, 'cwd')
    spy.mockReturnValue(path.join(__dirname, './fixtures/fake-project'))

    const projectData = await foxUtilsProjects.getProjectData()

    expect(projectData.packageJson.name).toBe('fake-project')
    expect(projectData.packageJson).toHaveProperty('license')

    const packageJsonPath = path.join(__dirname, './fixtures/fake-project/package.json')
    expect(projectData.packageJsonPath).toBe(packageJsonPath)

    const location = path.join(__dirname, './fixtures/fake-project')
    expect(projectData.location).toBe(location)
  })
})

