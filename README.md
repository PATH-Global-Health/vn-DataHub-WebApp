# Front-End Master v2

###### Upgraded from _**VKHospital**_ project.

## Technologies used:

- [React](http://reactjs.org/)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux](https://redux.js.org/), [Redux Thunk](https://github.com/reduxjs/redux-thunk)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Semantic UI](https://react.semantic-ui.com/)

## Modules:

- [x] Catalog
- [x] Working Schedule
- [x] Telemedicine
- [x] Vaccination/Immunization
- [x] Examination
- [ ] TeleHealth
- [ ] Medical Booking Record
- [ ] HomeCare

## Folder Structures:

```
|---📂 src
    |
    |---📂 @app -> Shared modules here
    |
    |---📂 admin -> Admin module (not implemented yet)
    |
    |---📂 csyt -> All of other modules for hospital listed above
        |
        |---📂 catalog -> Catalog module
        |   |
        |   |---📂 doctor -> Doctor Page
        |   |   |
        |   |   |---📂 components -> Components for module
        |   |   |
        |   |   |---📄 doctor.model.ts -> Model for Catalog/Doctor module
        |   |   |
        |   |   |---📄 doctor.service.ts -> Service
        |   |   |
        |   |   |---📄 doctor.slice.ts -> Redux slice
        |   |   |
        |   |   |---📄 index.ts -> Doctor page
        |   |
        |   |---📂 service
        |   |
        |   |---📂 other sub modules...
        |
        |---📂 working-schedule
        |
        |---📂 telemedicine
        |
        |---📂 other modules...
```

- Every modules/sub-module should have:
  - An index page file (`index.ts`)
  - A redux slice file (`[module-name].slice.ts`)
  - A service file (`[module-name].service.ts`)
  - A model file (`[module-name].model.ts`)
  - A components folder

## Convention:

- Folders and Files naming convention: kebab-case
- TypeScript: ESLint with Airbnb' rules _(Please **DO NOT** disable ESLint extension)_
- Git: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) with [GitFlow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

## Others:

- All API links should be declare inside `apiLinks` from `src/@app/utils/api-links.ts`
- Only use `useSelector` and `useDispatch` from `'@app/hooks'` for TypeScript supports
- Don't touch folder `src/semantic-ui` (this folder is for UI customization)
- Declare all pages in `componentTree` from `'@app/utils/component-tree.tsx'`
- Every page has its own `GroupKey` and `ComponentKey` declared in enums for app tab interaction and app tab refresh
- Use `useAuth.hasPermission` from `'@app/hooks/use-auth'` for authorization in UI
- `componentTree` also use the `hasPermission` to display corresponding menu for each permission list
- Permissions should be declare in the state of `auth` slice from `'src/@app/slices/auth.ts'`
