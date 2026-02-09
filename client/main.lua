ESX = exports['es_extended']:getSharedObject()

local isUIOpen = false

print('[esx_identity] Client script loaded!')

RegisterNetEvent('esx_identity:showRegisterIdentity')
AddEventHandler('esx_identity:showRegisterIdentity', function()
    print('[esx_identity] showRegisterIdentity called')
    openIdentityUI()
end)

RegisterNetEvent('esx:playerLoaded')
AddEventHandler('esx:playerLoaded', function()
    print('[esx_identity] Player loaded')
end)

function openIdentityUI()
    if isUIOpen then return end
    isUIOpen = true
    
    print('[esx_identity] Opening UI...')
    
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'open',
        config = {
            maxNameLength = Config.MaxNameLength,
            minNameLength = Config.MinNameLength,
            minAge = Config.MinAge,
            maxAge = Config.MaxAge,
            minHeight = Config.MinHeight,
            maxHeight = Config.MaxHeight,
            nationalities = Config.Nationalities,
            enableHeight = Config.EnableHeight,
            enableNationality = Config.EnableNationality,
            enableBirthplace = Config.EnableBirthplace
        }
    })
end

RegisterNUICallback('submitIdentity', function(data, cb)
    print('[esx_identity] Submitting identity...')
    TriggerServerEvent('esx_identity:registerIdentity', data)
    cb('ok')
end)

RegisterNUICallback('closeUI', function(data, cb)
    isUIOpen = false
    SetNuiFocus(false, false)
    cb('ok')
end)

RegisterNetEvent('esx_identity:identityRegistered')
AddEventHandler('esx_identity:identityRegistered', function()
    isUIOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({ action = 'close' })
end)

RegisterNetEvent('esx_identity:showError')
AddEventHandler('esx_identity:showError', function(message)
    SendNUIMessage({
        action = 'showError',
        message = message
    })
end)

RegisterCommand('testidentity', function()
    print('[esx_identity] Test command triggered')
    openIdentityUI()
end, false)
