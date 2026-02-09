ESX = exports['es_extended']:getSharedObject()

print('[esx_identity] Server script loaded!')

RegisterNetEvent('esx_identity:registerIdentity')
AddEventHandler('esx_identity:registerIdentity', function(data)
    local source = source
    
    print('[esx_identity] registerIdentity called from source: ' .. tostring(source))
    print('[esx_identity] Data: ' .. json.encode(data))
    
    if not data.firstname or not data.lastname or not data.dateofbirth or not data.sex then
        TriggerClientEvent('esx_identity:showError', source, 'Wypelnij wszystkie wymagane pola!')
        return
    end
    
    if string.len(data.firstname) < Config.MinNameLength or string.len(data.firstname) > Config.MaxNameLength then
        TriggerClientEvent('esx_identity:showError', source, 'Nieprawidlowa dlugosc imienia!')
        return
    end
    
    if string.len(data.lastname) < Config.MinNameLength or string.len(data.lastname) > Config.MaxNameLength then
        TriggerClientEvent('esx_identity:showError', source, 'Nieprawidlowa dlugosc nazwiska!')
        return
    end
    
    local identityData = {
        firstname = data.firstname,
        lastname = data.lastname,
        dateofbirth = data.dateofbirth,
        sex = data.sex,
        height = data.height or 175
    }
    
    TriggerClientEvent('esx_identity:identityRegistered', source)
    TriggerEvent('esx_identity:completedRegistration', source, identityData)
    
    print('[esx_identity] Identity registered and completedRegistration triggered')
end)
