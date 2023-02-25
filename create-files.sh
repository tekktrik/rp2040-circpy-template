truncate fat12.img -s 1M
mkfs.vfat -F12 -S512 fat12.img
mkdir fatmount
sudo mount -o loop fat12.img fatmount/
sudo cp tests/CIRCUITPY/* -r fatmount/
sudo umount fatmount
sudo rm -rf fatmount
wget https://downloads.circuitpython.org/bin/raspberry_pi_pico/en_US/adafruit-circuitpython-raspberry_pi_pico-en_US-8.0.3.uf2 -O firmware.uf2
